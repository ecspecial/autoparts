import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossReference } from './entities/cross-reference.entity';
import { CrossCsvImportService } from './services/cross-csv-import.service';
import { CrossReferenceController } from './cross-reference.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CrossReference])],
  controllers: [CrossReferenceController],
  providers: [CrossCsvImportService],
  exports: [CrossCsvImportService],
})
export class CrossReferenceModule {}