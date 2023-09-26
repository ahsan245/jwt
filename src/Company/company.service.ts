/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  constructor(@InjectModel('Company') private readonly companyModel: Model<Company>) {}

  async createCompany(model: any): Promise<Company> {
    const company = new this.companyModel(model);
    return company.save();
  }

  async updateCompany(uuid: string, model: any): Promise<Company> {
    const company = await this.companyModel.findById(uuid);

    if (!company) {
      throw new Error(uuid);
    }
    const version = (parseInt(company.version) + 1).toString();

    company.display_name = model.display_name;
    company.meta = model.meta;
    company.version = version;
    return company.save();
  }


  
}