import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../controller/app.controller';
import { GetRelevantCompanies } from '../search/get-revelant-companies.use-case';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [GetRelevantCompanies],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
