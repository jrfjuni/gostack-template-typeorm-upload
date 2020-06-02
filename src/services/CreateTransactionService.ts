import { getCustomRepository, getRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value)
      throw new AppError('You do not have enough balance.');

    let categoryEntity = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryEntity);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: categoryEntity.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
