import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DocumentationService } from './documentation.service';

@Controller('documentation')
export class DocumentationController {
  constructor(private readonly documentationService: DocumentationService) {}

  /**
   * Get list of all available documentation files
   */
  @Get()
  async getAllDocuments() {
    return this.documentationService.getAllDocuments();
  }

  /**
   * Get specific documentation file content
   */
  @Get(':filename')
  async getDocument(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const content = await this.documentationService.getDocumentContent(filename);
      return res.status(HttpStatus.OK).json({
        success: true,
        filename,
        content,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: `Document not found: ${filename}`,
      });
    }
  }

  /**
   * Get SEMOP Master Blueprint
   */
  @Get('master/blueprint')
  async getMasterBlueprint(@Res() res: Response) {
    try {
      const content = await this.documentationService.getMasterBlueprint();
      return res.status(HttpStatus.OK).json({
        success: true,
        filename: 'SEMOP_MASTER_BLUEPRINT.md',
        content,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Master Blueprint not found',
      });
    }
  }

  /**
   * Get Maps System Guide
   */
  @Get('maps/system-guide')
  async getMapsSystemGuide(@Res() res: Response) {
    try {
      const content = await this.documentationService.getMapsSystemGuide();
      return res.status(HttpStatus.OK).json({
        success: true,
        filename: 'maps-system-guide.md',
        content,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'Maps System Guide not found',
      });
    }
  }
}
