import { DataSource } from "typeorm";
import { CompteTransaction } from "../database/entities/transaction";

export interface ListTransactionFilter {
    limit: number,
    page: number,
    type?: string,
    userId?: number,
    assoId?: number
}

export class TransactionUseCase {
    constructor(private readonly db: DataSource) { }

    async getListTransactions(listTransactionFilter: ListTransactionFilter): Promise<{ transactions: CompteTransaction[]; }> {
        const query = this.db.createQueryBuilder(CompteTransaction, 'transaction')
        query.skip((listTransactionFilter.page - 1) * listTransactionFilter.limit)
        query.take(listTransactionFilter.limit)
        query.innerJoin("transaction.association", "asso")
        query.leftJoinAndSelect("transaction.user", "user")

        if(listTransactionFilter.type !== undefined) {
            query.andWhere("transaction.type = :type", {type: listTransactionFilter.type})
        }

        if(listTransactionFilter.userId !== undefined) {
            query.andWhere("user.id = :userId", {userId: listTransactionFilter.userId})
        }

        if(listTransactionFilter.assoId !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: listTransactionFilter.assoId})
        }

        const transactions = await query.getMany()
        return {
            transactions
        }
    }
}