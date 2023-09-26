/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, HttpStatus, Put, Param } from '@nestjs/common';
import {CompanyService} from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(@Body() body: any, @Res() res: any) {
    try {
        // await validateOrReject(CompanyDto);
    } catch (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errorMessages });
    }

    const model = {
      display_name: body.display_name,
      meta: body.meta,
      version: '1',
    };

    try {
      const results = await this.companyService.createCompany(model);
      const response = {
        timestamp_ms: Date.now(),
        action: 'create',
        company: {
          uuid: results._id.toString(),
          display_name: results.display_name,
          version: results.version,
          meta: results.meta,
        },
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error('Error in create company:', error);
      throw error;
    }
  }

  @Put(':uuid')
  async updateCompany(@Param('uuid') uuid: string, @Body() body: any, @Res() res: any) {
    try {
      // await validateOrReject(CompanyDto);
    } catch (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({ errors: errorMessages });
    }

    const model = {
      display_name: body.display_name,
      meta: body.meta,
      version: '1',
    };

    try {
      const results = await this.companyService.updateCompany(uuid, model);
      
      const response = {
        timestamp_ms: Date.now(),
        action: 'update',
        company: {
          uuid: results._id.toString(),
          display_name: results.display_name,
          version: results.version,
          meta: results.meta,
        },
      };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: 'Company not Updated'+error });
    }
  }
}


