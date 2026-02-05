import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CrossCsvImportService } from './services/cross-csv-import.service';

class ImportDto {
  password: string;
}

@ApiTags('Cross-Reference')
@Controller('cross-reference')
export class CrossReferenceController {
  private readonly IMPORT_PASSWORD = process.env.CROSS_IMPORT_PASSWORD || 'change-me-in-production';

  constructor(private readonly crossCsvImportService: CrossCsvImportService) {}

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Import cross-reference data from CSV file',
    description: 'Reads cross_site.csv from server and imports OEM cross-references. Requires password authentication.'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', example: 'your-secret-password' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Import successful' })
  @ApiResponse({ status: 401, description: 'Invalid password' })
  async importCrossReference(@Body() body: ImportDto) {
    if (body.password !== this.IMPORT_PASSWORD) {
      throw new UnauthorizedException('Invalid password');
    }

    const result = await this.crossCsvImportService.importFromCsv();
    
    return {
      success: true,
      message: 'Cross-reference data imported successfully',
      ...result
    };
  }
}