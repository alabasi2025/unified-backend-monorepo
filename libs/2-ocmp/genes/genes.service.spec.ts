/**
 * PHASE-11: Complete Backend Tests
 * COMPONENT: Genes Service Tests
 * IMPACT: Critical
 * 
 * Date: 2025-12-03
 * Author: Development Team
 */

import { Test, TestingModule } from '@nestjs/testing';
import { GenesService } from './genes.service';
import { PrismaService } from '../../1-core-services/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('GenesService', () => {
  let service: GenesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    gene: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GenesService>(GenesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genes', async () => {
      const mockGenes = [{ id: 1, name: 'Gene 1' }, { id: 2, name: 'Gene 2' }];
      mockPrismaService.gene.findMany.mockResolvedValue(mockGenes);

      const result = await service.findAll();
      expect(result).toEqual(mockGenes);
      expect(prisma.gene.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a gene by id', async () => {
      const mockGene = { id: 1, name: 'Gene 1' };
      mockPrismaService.gene.findUnique.mockResolvedValue(mockGene);

      const result = await service.findOne(1);
      expect(result).toEqual(mockGene);
      expect(prisma.gene.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if gene not found', async () => {
      mockPrismaService.gene.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new gene', async () => {
      const createDto = { name: 'New Gene', description: 'Test' };
      const mockGene = { id: 1, ...createDto };
      mockPrismaService.gene.create.mockResolvedValue(mockGene);

      const result = await service.create(createDto as any);
      expect(result).toEqual(mockGene);
      expect(prisma.gene.create).toHaveBeenCalledWith({ data: createDto });
    });
  });

  describe('update', () => {
    it('should update a gene', async () => {
      const updateDto = { name: 'Updated Gene' };
      const mockGene = { id: 1, ...updateDto };
      mockPrismaService.gene.update.mockResolvedValue(mockGene);

      const result = await service.update(1, updateDto as any);
      expect(result).toEqual(mockGene);
      expect(prisma.gene.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a gene', async () => {
      const mockGene = { id: 1, name: 'Gene 1' };
      mockPrismaService.gene.delete.mockResolvedValue(mockGene);

      const result = await service.remove(1);
      expect(result).toEqual(mockGene);
      expect(prisma.gene.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
