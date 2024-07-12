import { ForeignKeyConstraintEnum } from "../enums/foreign-key-constraint.enum";
import { GeneralMessageKeyEnum } from "../enums/general-message-key.enum";
import { ApiError } from "./api-error.model";

export class ApiForeignKeyConstraintError extends ApiError {
  constructor(public constraint: ForeignKeyConstraintEnum) {
    super(GeneralMessageKeyEnum.FOREIGN_KEY_CONSTRAINT_VIOLATION);
  }
}
