import cron from 'node-cron';
import { UserUseCase } from '../domain/user-usecase';
import { AppDataSource } from '../database/database';
import { Adhesion } from '../database/entities/adhesion';

async function checkMemberShipValidation() {
    const userUseCase = new UserUseCase(AppDataSource)
    const listAdherant = await userUseCase.getListAdherant(undefined, false)
    const today = new Date()

    listAdherant.users.forEach(async (user) => {
        if(user.adhesion.endDate > today) {
            await AppDataSource.getRepository(Adhesion).save({...user.adhesion, isActive: false})
        }
    })
}

cron.schedule('*/30 * * * *', checkMemberShipValidation);