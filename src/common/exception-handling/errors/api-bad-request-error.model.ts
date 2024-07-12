import { ValidationError } from "@nestjs/common";
import { GeneralMessageKeyEnum } from "../enums/general-message-key.enum";
import { ApiError } from "./api-error.model";

export class ApiBadRequestError extends ApiError {
  fieldErrors?: FieldError[];

  constructor(validationErrors: ValidationError[]) {
    super(GeneralMessageKeyEnum.BAD_REQUEST);
    this.createErrorsFromMessage(validationErrors);
  }

  createErrorsFromMessage(validationErrors: ValidationError[]) {
    this.fieldErrors = [];
    for (const validationError of validationErrors) {
      if (validationError && validationError.constraints) {
        for (const [key, value] of Object.entries(
          validationError.constraints,
        )) {
          const error = new FieldError();
          error.field = validationError.property;
          error.constraint = key;
          error.params = value as string;
          this.fieldErrors.push(error);
        }
      }
    }
  }
}

class FieldError {
  field: string;
  constraint: string;
  params?: string;
}
