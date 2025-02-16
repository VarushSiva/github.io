"use strict";

/**
 * Represents a Contact with a name, contact number and email address
 */

(function (core) {
  class Contact {
    /**
     * Constucts a new Contact instance
     * @param {*} fullName
     * @param {*} contactNumber
     * @param {*} emailAddress
     */
    constructor(fullName = "", contactNumber = "", emailAddress = "") {
      this._fullName = fullName;
      this._contactNumber = contactNumber;
      this._emailAddress = emailAddress;
    }

    // ------------------------------------------ Full Name ---------------------------------------
    /**
     * Gets the full name of the contact
     * @returns {string}
     */
    get fullName() {
      return this._fullName;
    }
    /**
     * Sets the full name of the contact. Validates input to ensure it's a non-empty string
     * @param fullName
     */
    set fullName(fullName) {
      if (typeof fullName !== "string" || fullName.trim() === "") {
        throw new Error("Invalid fullName: must be a non-empty string");
      }
      this._fullName = fullName;
    }

    // ------------------------------------------ Contact Number ---------------------------------------
    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get contactNumber() {
      return this._contactNumber;
    }
    /**
     * Sets the contact number of the contact. Validates input to ensure it's a 10 digit number
     * @param contactNumber
     */
    set contactNumber(contactNumber) {
      const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(contactNumber)) {
        throw new Error(
          "Invalid contactNumber: Must be a 10-digit number in the format ###-###-####"
        );
      }
      this._contactNumber = contactNumber;
    }

    // ------------------------------------------ Email Address ---------------------------------------
    /**
     * Gets the email address of the contact
     * @returns {string}
     */
    get emailAddress() {
      return this._emailAddress;
    }
    /**
     * Sets the email address of the contact. Validates input to ensure it's valid email format
     * @param emailAddress
     */
    set emailAddress(emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        throw new Error("Invalid emailAddress: Must be a valid emailAddress");
      }
      this._emailAddress = emailAddress;
    }

    /**
     * Converts the contact details into a human-readable string
     * @returns {string}
     */
    toString() {
      return `FullName: ${this._fullName}\nContactNumber: ${this._contactNumber}\nEmailAddress: ${this._emailAddress}`;
    }

    /**
     * Serializes the contact details into a string format suitable for storage
     * @returns {string|null}
     */
    serialize() {
      if (!this._fullName || !this._contactNumber || !this._emailAddress) {
        console.error(
          "One or more of the contact properties are missing or invalid"
        );
        return null;
      }
      return `${this._fullName},${this._contactNumber},${this._emailAddress}`;
    }

    /**
     * Deserializes a string (comma delimited) of contact details and update properties
     * @param data
     */
    deserialize(data) {
      if (typeof data !== "string" || data.split(",").length !== 3) {
        console.error("Invalid data format for deserializing data.");
        return;
      }

      const propArray = data.split(",");
      this._fullName = propArray[0];
      this._contactNumber = propArray[1];
      this._emailAddress = propArray[2];
    }
  }
  core.Contact = Contact;
})(core || (core = {}));
