import cron from 'node-cron';
import { UserUseCase } from '../domain/user-usecase';
import { AppDataSource } from '../database/database';
import { Adhesion } from '../database/entities/adhesion';
import { bodyMailAdhesionExpirationSoon, bodyMailAssemblee, sendEmail } from '../service/mail';
import { Assemblee } from '../database/entities/assemblee';
import { Association } from '../database/entities/association';
import { VoteUseCase } from '../domain/vote-usecase';
import { Vote } from '../database/entities/vote';
import { Reponse } from '../database/entities/reponse';
import { AssembleeUseCase } from '../domain/assemblee-usecase';
import { ReponseUseCase } from '../domain/reponse-usecase';

export async function checkMemberShipValidation() {
    const userUseCase = new UserUseCase(AppDataSource)

    const listAssociation = await AppDataSource.getRepository(Association).find({relations: ["users"]})
    listAssociation.forEach(async (association) => {
        const listAdherant = await userUseCase.getListAdherant(association, false)
        const today = new Date()

        listAdherant.users.forEach(async (user) => {
            const endDate = new Date(user.adhesion.endDate)
            if(endDate < today) {
                user.adhesion.isActive = false
                await AppDataSource.getRepository(Adhesion).save(user.adhesion)
            }
        })
    })
}

export async function checkLessThanTenDaysMemberShip() {
    const userUseCase = new UserUseCase(AppDataSource)
    

    const listAssociation = await AppDataSource.getRepository(Association).find({relations: ["users"]})
    listAssociation.forEach(async (association) => {
        const listAdherant = await userUseCase.getListAdherant(association, false)
        const today = new Date()
        today.setDate(today.getDate() + 10)
        listAdherant.users.forEach(async (user) => {
            const endDate = new Date(user.adhesion.endDate)
            
            if(endDate < today) {
                try {
                    if(process.env.EMAIL_USER) {
                        sendEmail({
                            to: user.email,
                            from: process.env.EMAIL_USER,
                            subject: "Adhésion expirée dans quelques jours",
                            text: bodyMailAdhesionExpirationSoon(user.adhesion, user)
                        })
                    }
                }
                catch(err) {
                    console.log(err)
                }
            }
        })
    })
    
}

export async function createAssembleeYearly() {
    const listAssociation = await AppDataSource.getRepository(Association).find({relations: ["users"]})
    listAssociation.forEach(async (association) => {

        const createdAssemblee = await AppDataSource.getRepository(Assemblee).save({location: "", beginDate: new Date(new Date().getUTCFullYear(), 8, 2, 8, 0, 0), endDate: new Date(new Date().getUTCFullYear(), 8, 2, 20, 0, 0), description: "Assemblée générale annuelle", association: association})

        const userUseCase = new UserUseCase(AppDataSource)
        const listAdherant = await userUseCase.getListAdherant(association, false)

        listAdherant.users.forEach((user) => {
            if(process.env.EMAIL_USER) {
                sendEmail({
                    to: user.email,
                    from: process.env.EMAIL_USER,
                    subject: "Assemblée générale annuelle",
                    text: bodyMailAssemblee(createdAssemblee, user)
                })
            }
        })
    })
}

function isActive(beginDate: Date, endDate: Date): boolean {
    const dateBegin = new Date(beginDate)
    const dateEnd = new Date(endDate)
    const today = new Date()

    console.log(dateBegin)
    console.log(dateEnd)
    console.log(today+"\n")

    if(today >= dateBegin && today < dateEnd) {
        return true
    } else {
        return false
    }
}

function isFinish(endDate: Date): boolean {
    const dateEnd = new Date(endDate)
    const today = new Date()

    if(dateEnd < today) {
        return true
    } else {
        return false
    }
}

export async function createVote() {
    const listAssociation = await AppDataSource.getRepository(Association).find({relations: ["users"]})
    const assembleeUseCase = new AssembleeUseCase(AppDataSource)
    listAssociation.forEach(async (association) => {

        const listAssemblee = (await assembleeUseCase.getListAssemblee({page: 1, limit: 10000, associationId: association.id})).assemblees
        const listAssembleeActive = listAssemblee.filter((assemblee) => isActive(assemblee.beginDate, assemblee.endDate))
        listAssembleeActive.forEach(async (assemblee) => {
            const voteUseCase = new VoteUseCase(AppDataSource)
            const listVote = (await voteUseCase.getListVote({page:1, limit: 10000, associationId: association.id, assembleeId: assemblee.id})).Votes
            const listVoteFinish = listVote.filter((vote) => isFinish(vote.endDate) && vote.isValid)

            const userUseCase = new UserUseCase(AppDataSource)
            const listAdherant = (await userUseCase.getListAdherant(association, false)).users
            const nbAdherant = listAdherant.length

            listVoteFinish.forEach(async (vote) => {
                const reponseUseCase = new ReponseUseCase(AppDataSource)
                const listReponse = (await reponseUseCase.getListReponse({page: 1, limit: 10000, assoId: association.id, voteId: vote.id})).Reponses
                const nbVoteTotal = listReponse.reduce((accumulator, reponse) => accumulator + reponse.nbVote, 0)
                //Vérifie le quorum, créé un nouveau vote si cela ne convient pas
                if(nbVoteTotal <= (nbAdherant / 4)) {
                    vote.isValid = false
                    await AppDataSource.getRepository(Vote).save(vote)
                    const diffInMilliseconds = vote.endDate.getTime() - vote.beginDate.getTime()
                    const today = new Date();
                    const newDateEnd = new Date(today.getTime() + diffInMilliseconds)
                    const voteCreated = await AppDataSource.getRepository(Vote).save({name: vote.name,association: association, assemblee: assemblee, beginDate: today, endDate: newDateEnd, parentVote: vote.parentVote})
                    listReponse.forEach(async (reponse) => await AppDataSource.getRepository(Reponse).save({name: reponse.name, applicants: reponse.applicants, vote: voteCreated}))
                } else {
                    let bestReponse = listReponse[0]
                    listReponse.forEach((reponse) => {
                        if(reponse.nbVote > bestReponse.nbVote) {
                            bestReponse = reponse
                        }
                    })
                    if(vote.childVote === null && bestReponse.nbVote < (nbVoteTotal / 2)) {

                        const listReponseMax: Reponse[] = []
                        for (let index = 0; index < 3; index++) {
                            let maxVote = listReponse[0]
                            listReponse.forEach((reponse) => {
                                if((reponse.nbVote > maxVote.nbVote) && !listReponseMax.includes(reponse)) {
                                    maxVote = reponse
                                }
                            })
                            listReponseMax.push(maxVote)
                        }
                        const diffInMilliseconds = vote.endDate.getTime() - vote.beginDate.getTime()
                        const today = new Date()
                        const newDateEnd = new Date(today.getTime() + diffInMilliseconds)
                        const voteCreated = await AppDataSource.getRepository(Vote).save({name: "Second tour", beginDate: today, endDate: newDateEnd, assemblee: vote.assemblee, association: vote.association, parentVote: vote})
                        listReponseMax.forEach(async (reponse) => await AppDataSource.getRepository(Reponse).save({name: reponse.name, applicants: reponse.applicants, vote: voteCreated}))
                    }
                }
            })

        })
    })
}

export const scheduleTask = () => {
    cron.schedule('*/30 * * * *', async () => await checkMemberShipValidation())
    cron.schedule('0 2 * * *',async () => await checkLessThanTenDaysMemberShip(),
    {
        scheduled: true,
        timezone: "Europe/Paris"
    })
    cron.schedule("0 2 24 7 *", async () => await createAssembleeYearly())
    cron.schedule('*/30 * * * *', async () => await createVote())
}