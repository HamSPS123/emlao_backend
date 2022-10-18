/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty } from 'class-validator';

export class ReportOrderDetail {
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    endDate: Date;
}
