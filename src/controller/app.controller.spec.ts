import { Test, TestingModule } from "@nestjs/testing";
import { AddPatientsController } from "./patients.controller";
import { AddPatientsService } from "src/service";

describe("AppController", () => {
  let appController: AddPatientsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AddPatientsController],
      providers: [AddPatientsService],
    }).compile();

    appController = app.get<AddPatientsController>(AddPatientsController);
  });

  describe("root", () => {
    // it('should return "Hello World!"', () => {
    //   expect(AddPatientsController.getHello()).toBe('Hello World!');
    // });
  });
});
