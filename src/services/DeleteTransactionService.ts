import { getCustomRepository, Transaction } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = transactionRepository.findOne(id);

    if (!transaction) throw new AppError('Transaction does not exist.');

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
