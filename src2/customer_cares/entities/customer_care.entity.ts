import { Admin } from 'src/admin/entities/admin.entity';
import { CustomerCareInquiry } from 'src/customer_cares_inquires/entities/customer_care_inquiry.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToMany,
  OneToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('customer_cares')
export class CustomerCare {
  @PrimaryColumn()
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: User;

  @Column('jsonb', { nullable: true })
  contact_email: Array<{
    title: string;
    is_default: boolean;
    email: string;
  }>;

  @Column('jsonb', { nullable: true })
  contact_phone: Array<{
    title: string;
    number: string;
    is_default: boolean;
  }>;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @OneToMany(
    () => CustomerCareInquiry,
    inquiry => inquiry.assigned_customer_care
  )
  assigned_tickets: CustomerCareInquiry[];

  @Column({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW())' })
  created_at: number;

  @Column({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW())' })
  updated_at: number;

  @Column({
    nullable: true,
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM NOW())'
  })
  last_login: number;

  @Column('jsonb', { nullable: true })
  avatar: {
    key: string;
    url: string;
  };

  @Column({ default: false })
  available_for_work: boolean;

  @Column({ default: false })
  is_assigned: boolean;

  @Column({ default: 0 }) // Điểm tích lũy cho lương/bonus
  active_point: number;

  @Column({ default: 0 }) // Số inquiry đang xử lý
  active_workload: number;

  @ManyToMany(() => Admin, admin => admin.assigned_customer_care)
  admins: Admin[];

  @BeforeInsert()
  generateId() {
    this.id = `FF_CC_${uuidv4()}`;
    const now = Math.floor(Date.now() / 1000);
    this.created_at = now;
    this.updated_at = now;
    this.active_point = 0;
    this.active_workload = 0;
  }
}
