import { Injectable } from '@nestjs/common';
import { CreateFWalletDto } from './dto/create-fwallet.dto';
import { UpdateFwalletDto } from './dto/update-fwallet.dto';
import { FWalletsRepository } from './fwallets.repository';
import { createResponse } from 'src/utils/createResponse';
import { ApiResponse } from 'src/utils/createResponse';
import { FWallet } from './entities/fwallet.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class FWalletService {
  constructor(private readonly fWalletsRepository: FWalletsRepository) {}

  async create(
    createFWalletDto: CreateFWalletDto
  ): Promise<ApiResponse<FWallet>> {
    try {
      const existingWallet = await this.fWalletsRepository.findByUserId(
        createFWalletDto.user_id
      );

      if (existingWallet) {
        return createResponse(
          'DuplicatedRecord',
          null,
          'Wallet for this user already exists'
        );
      }

      const newWallet = await this.fWalletsRepository.create(createFWalletDto);
      return createResponse('OK', newWallet, 'Wallet created successfully');
    } catch (error: any) {
      console.error('Error creating wallet:', error);
      return createResponse('ServerError', null, 'Error creating wallet');
    }
  }

  async findAll(): Promise<ApiResponse<FWallet[]>> {
    try {
      const wallets = await this.fWalletsRepository.findAll();
      return createResponse('OK', wallets, 'Fetched all wallets');
    } catch (error: any) {
      console.error('Error fetching wallets:', error);
      return createResponse('ServerError', null, 'Error fetching wallets');
    }
  }

  async findBySearchQuery(query: string): Promise<ApiResponse<FWallet[]>> {
    try {
      const wallets = await this.fWalletsRepository.findBySearchQuery(query);
      return createResponse('OK', wallets, 'Fetched wallets by search query');
    } catch (error: any) {
      console.error('Error fetching wallets by search query:', error);
      return createResponse(
        'ServerError',
        null,
        'Error fetching wallets by search query'
      );
    }
  }

  async findFWalletById(id: string): Promise<ApiResponse<FWallet>> {
    try {
      const wallet = await this.fWalletsRepository.findById(id);
      if (!wallet) {
        return createResponse('NotFound', null, 'Wallet not found');
      }
      return createResponse('OK', wallet, 'Wallet retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching wallet:', error);
      return createResponse('ServerError', null, 'Error fetching wallet');
    }
  }

  async findOne(conditions: object): Promise<ApiResponse<FWallet>> {
    try {
      const wallet = await this.fWalletsRepository.findByCondition(conditions);
      if (!wallet) {
        return createResponse('NotFound', null, 'Wallet not found');
      }
      return createResponse('OK', wallet, 'Wallet retrieved successfully');
    } catch (error: any) {
      console.error('Error fetching wallet:', error);
      return createResponse('ServerError', null, 'Error fetching wallet');
    }
  }

  async update(
    id: string,
    updateFWalletDto: UpdateFwalletDto
  ): Promise<ApiResponse<any>> {
    try {
      const wallet = await this.fWalletsRepository.findById(id);
      if (!wallet) {
        return createResponse('NotFound', null, 'Wallet not found');
      }

      const updatedWallet = await this.fWalletsRepository.update(
        id,
        updateFWalletDto
      );
      return createResponse('OK', updatedWallet, 'Wallet updated successfully');
    } catch (error: any) {
      console.error('Error updating wallet:', error);
      return createResponse('ServerError', null, 'Error updating wallet');
    }
  }

  async remove(id: string): Promise<ApiResponse<null>> {
    try {
      const result = await this.fWalletsRepository.delete(id);
      if (!result) {
        return createResponse('NotFound', null, 'Wallet not found');
      }
      return createResponse('OK', null, 'Wallet deleted successfully');
    } catch (error: any) {
      console.error('Error deleting wallet:', error);
      return createResponse('ServerError', null, 'Error deleting wallet');
    }
  }

  async findHistoryTransaction(
    fWalletId: string
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const wallet = await this.fWalletsRepository.findById(fWalletId);
      if (!wallet) {
        return createResponse('NotFound', null, 'Wallet not found');
      }
      const transactions =
        await this.fWalletsRepository.findHistoryTransaction(fWalletId);
      return createResponse(
        'OK',
        transactions,
        'Fetched transaction history successfully'
      );
    } catch (error: any) {
      console.error('Error fetching transaction history:', error);
      return createResponse(
        'ServerError',
        null,
        'Error fetching transaction history'
      );
    }
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<
    ApiResponse<{
      totalPages: number;
      currentPage: number;
      totalItems: number;
      items: FWallet[];
    }>
  > {
    try {
      const skip = (page - 1) * limit;
      const [wallets, total] = await this.fWalletsRepository.findAllPaginated(
        skip,
        limit
      );
      const totalPages = Math.ceil(total / limit);

      return createResponse(
        'OK',
        {
          totalPages,
          currentPage: page,
          totalItems: total,
          items: wallets
        },
        'Fetched paginated wallets'
      );
    } catch (error: any) {
      console.error('Error fetching paginated wallets:', error);
      return createResponse(
        'ServerError',
        null,
        'Error fetching paginated wallets'
      );
    }
  }
}
