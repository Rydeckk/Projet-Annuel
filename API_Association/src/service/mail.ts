import nodemailer from 'nodemailer';
import { Assemblee } from '../database/entities/assemblee';
import { Adhesion } from '../database/entities/adhesion';
import { CompteTransaction } from '../database/entities/transaction';
import { User } from '../database/entities/user';

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: string | Buffer;
    }>;
}

export const formatDate = (dateISO: Date): string => {
    const date = new Date(dateISO);
    
    const pad = (n: number): string => n < 10 ? `0${n}` : n.toString();
  
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); 
    const year = date.getFullYear();
  
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
};

export const bodyMailAssemblee = (assemblee: Assemblee, user: User): string => {
    const dateBegin = formatDate(assemblee.beginDate).split(" ")[1]
    const timeBegin = formatDate(assemblee.beginDate).split(" ")[0]
    const dateEnd = formatDate(assemblee.endDate).split(" ")[1]
    const timeEnd = formatDate(assemblee.endDate).split(" ")[0]
    return "Bonjour " + user.firstName + " " + user.lastName 
        + ", \n\nMerci pour votre soutien ! \nNous vous invitions à l'assemblée générale de l'association qui aura lieu à " 
        + timeBegin + " le " + dateBegin + " et finira à " + timeEnd + " le " + dateEnd
        + ".\nLe thème sera : " + assemblee.description
        + ".\n\nCordialement"
}

export const bodyMailAdhesion = (adhesion: Adhesion, transaction: CompteTransaction, user: User ): string => {
    return "Bonjour " 
        + user.firstName + " " + user.lastName 
        + ", \n\nNous vous remercions pour votre adhésion ! \nVoici les détails de votre adhésion ci-dessous : \n - type : " 
        + adhesion.typeAdhesion.type + "\n - montant : " 
        + adhesion.typeAdhesion.montant + "€\n - Validité : "
        + formatDate(adhesion.endDate) + "\n\nCordialement"
}