import { v4 as uuid } from "uuid";
import { GeneralMessageKeyEnum } from "../enums/general-message-key.enum";

export class ApiError {
  id: string;
  timestamp: string;

  constructor(public messageKey: GeneralMessageKeyEnum) {
    this.id = uuid();
    this.timestamp = new Date().toISOString();
  }
}
