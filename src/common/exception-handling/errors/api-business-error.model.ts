import { BusinessConstraintEnum } from "../enums/business-constraint.enum";
import { GeneralMessageKeyEnum } from "../enums/general-message-key.enum";
import { ApiError } from "./api-error.model";

export class ApiBusinessError extends ApiError {
  constructor(public constraint: BusinessConstraintEnum) {
    super(GeneralMessageKeyEnum.CREDENTIALS_ERROR_VIOLATION);
  }
}
