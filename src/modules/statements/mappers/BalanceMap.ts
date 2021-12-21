import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map(function ({
      id,
      amount,
      description,
      user_id,
      type,
      created_at,
      updated_at
    }) {
      return type === 'transfer' ?
        {
          id,
          amount: Number(amount),
          description,
          sender_id: user_id,
          type,
          created_at,
          updated_at
        } :
        {
          id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
