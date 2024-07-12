import { GeneralMessageKeyEnum } from "../enums/general-message-key.enum";
import { UniqueKeyConstraintEnum } from "../enums/unique-key-constraint.enum";
import { ApiError } from "./api-error.model";

export class ApiUniqueKeyConstraintError extends ApiError {
  constructor(public constraint: UniqueKeyConstraintEnum) {
    super(GeneralMessageKeyEnum.UNIQUE_KEY_CONSTRAINT_VIOLATION);
  }
}
