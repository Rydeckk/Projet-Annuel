import cron from 'node-cron';
import { UserUseCase } from '../domain/user-usecase';
import { AppDataSource } from '../database/database';
import { Adhesion } from '../database/entities/adhesion';
import { bodyMailAdhesionExpirationSoon, sendEmail } from '../service/mail';

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

cron.schedule('*/30 * * * *', checkMemberShipValidation)

async function checkLessThanTenDaysMemberShip() {
    const userUseCase = new UserUseCase(AppDataSource)
    const listAdherant = await userUseCase.getListAdherant(undefined, false)
    const today = new Date()
    today.setDate(today.getDate() + 10)

    listAdherant.users.forEach(async (user) => {
        if(user.adhesion.endDate > today) {
            try {
                if(process.env.EMAIL_USER) {
                    sendEmail({
                        to: user.email,
                        from: process.env.EMAIL_USER,
                        subject: "Adhésion expirée dans 10 jours",
                        text: bodyMailAdhesionExpirationSoon(user.adhesion, user)
                    })
                }
            }
            catch(err) {
                console.log(err)
            }
        }
    })
}

cron.schedule('0 2 * * *', checkLessThanTenDaysMemberShip,
    {
        scheduled: true,
        timezone: "Europe/Paris"
    }
)