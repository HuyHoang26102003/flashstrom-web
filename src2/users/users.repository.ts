import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.repository.create(userData);
    return this.repository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async findById(id: string, manager?: EntityManager): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.repository;
    return await repo.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateDto: UpdateUserDto,
    manager?: EntityManager
  ): Promise<UpdateResult> {
    console.log('Updating user with ID:', id);
    console.log('Update data:', updateDto);

    if (!id) {
      console.error('Update called with invalid ID:', id);
      throw new Error('User ID is required for update');
    }

    const repo = manager ? manager.getRepository(User) : this.repository;

    // Create clean update data
    const updateData: Partial<User> = {};

    // Only include defined fields
    Object.keys(updateDto).forEach(key => {
      if (updateDto[key] !== undefined) {
        if (key === 'verification_code') {
          updateData[key] = parseInt(updateDto[key]?.toString() || '0', 10);
        } else {
          updateData[key] = updateDto[key];
        }
      }
    });

    console.log('Final update data:', updateData);
    return repo.update({ id }, updateData);
  }

  async delete(id: string): Promise<{ affected?: number }> {
    return this.repository.delete(id);
  }

  async findOne(conditions: any): Promise<User | null> {
    // If conditions has a where clause, use it directly
    if (conditions.where) {
      return await this.repository.findOne(conditions);
    }
    // Otherwise use findOneBy for direct conditions
    return await this.repository.findOneBy(conditions);
  }
}
