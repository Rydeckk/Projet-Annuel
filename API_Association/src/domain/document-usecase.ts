import { DataSource } from "typeorm";
import { DocumentGED } from "../database/entities/document";
import { Association } from "../database/entities/association";
import { GED } from "../database/entities/ged";
import { Dossier } from "../database/entities/dossier";

export interface ListDocumentsFilter {
    limit: number,
    page: number,
    createdAfter?: Date,
    createdBefore?: Date,
    gedId?: number,
    folderId?: number
}

export interface UpdateDocumentGEDParams {
    name?: string,
    folderId?: number
}

export class DocumentGEDUseCase {
    constructor(private readonly db: DataSource) { }

    async getDocumentGED(id: number, ged?: GED): Promise <DocumentGED | null> {
        const repoDocumentGED = this.db.getRepository(DocumentGED)
        const documentFound = await repoDocumentGED.findOne({where: {id: id,ged: ged}, relations: ["ged","folder"]})
        if(documentFound === null) return null

        return documentFound
    }

    async getListDocumentGED(documentsFilter: ListDocumentsFilter): Promise <{ documents: DocumentGED[]}> {
        const query = this.db.createQueryBuilder(DocumentGED, 'document')
        query.innerJoin("document.ged","ged")
        query.leftJoinAndSelect("document.folder","folder")
        query.skip((documentsFilter.page - 1) * documentsFilter.limit)
        query.take(documentsFilter.limit)

        if(documentsFilter.createdAfter !== undefined) {
            query.andWhere("document.addedDate >= :createdAfter", {createdAfter: documentsFilter.createdAfter})
        }

        if(documentsFilter.createdBefore !== undefined) {
            query.andWhere("document.addedDate <= :createdBefore", {createdBefore: documentsFilter.createdBefore})
        }

        if(documentsFilter.gedId !== undefined) {
            query.andWhere("ged.id = :gedId", {gedId: documentsFilter.gedId})
        }

        if(documentsFilter.folderId !== undefined) {
            query.andWhere("folder.id = :folderId", {folderId: documentsFilter.folderId})
        }

        const documents = await query.getMany()
        return {
            documents
        }
    }

    async updateDocumentGED(id: number, documentParams: UpdateDocumentGEDParams, ged?: GED): Promise <DocumentGED | null> {
        const repoDocumentGED = this.db.getRepository(DocumentGED)
        const documentFound = await repoDocumentGED.findOne({where: {id: id, ged: ged}, relations: ["folder"]})
        if(documentFound === null) return null

        if(documentParams.name !== undefined) {
            documentFound.name = documentParams.name
        }

        if(documentParams.folderId !== undefined) {
            const folderFound = await this.db.getRepository(Dossier).findOne({where: {id: documentParams.folderId, ged: ged}})
            if(folderFound) {
                documentFound.folder = folderFound
            }
        }

        const updatedDocumentGED = await repoDocumentGED.save(documentFound)
        return updatedDocumentGED
    }

    async deleteDocumentGED(id: number, ged?: GED):Promise <DocumentGED | null> {
        const repoDocumentGED = this.db.getRepository(DocumentGED)
        const documentFound = await repoDocumentGED.findOne({where: {id: id, ged: ged}})
        if(documentFound === null) return null

        repoDocumentGED.delete({id: id})
        return documentFound
    }
}