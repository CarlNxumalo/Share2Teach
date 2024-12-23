class File {
    constructor(userID, path, type, approvedAt, status, report, grade, subjectID, fileSize, fileID) {
      this.setPath(path);
      this.setApprovedAt(approvedAt);
      this.setGrade(grade);
      this.setSubjectID(subjectID);
      this.setFileSize(fileSize);
      this.setType(type);
      this.setStatus(status);
      this.setReport(report);
      this.fileID = fileID;
      this.setUserID(userID);
    }
    // Getters
    getUserID() {
      return this.userID;
    }
  
    getPath() {
      return this.path;
    }
  
    getType() {
      return this.type;
    }
  
    getApprovedAt() {
      return this.approvedAt;
    }
  
    getStatus() {
      return this.status;
    }
  
    getReport() {
      return this.report;
    }
  
    getGrade() {
      return this.grade;
    }
  
    getSubjectID() {
      return this.subjectID;
    }
  
    getFileSize() {
      return this.fileSize;
    }
  
    // Setters with validation
    setUserID(value) {
      if (typeof value === 'number' && value > 0) {
        this.userID = value;
      } else {
        throw new Error("User ID not valid");
      }
    }
  
    setPath(value) {
      if (typeof value === 'string' && value.trim().length > 0) {
        this.path = value;
      } else {
        throw new Error("Path must be a non-empty string");
      }
    }
  
    setApprovedAt(value) {
      if (value instanceof Date || value === null) {
        this.approvedAt = value;
      } else {
        throw new Error("ApprovedAt must be a Date object or null");
      }
    }
  
    setGrade(value) {
      if (typeof value === 'string' && value.trim().length > 0) {
        this.grade = value;
      } else {
        throw new Error("Grade must be a non-empty string");
      }
    }
  
    setSubjectID(value) {
      if (typeof value === 'number' && value > 0) {
        this.subjectID = value;
      } else {
        throw new Error("Subject ID must be a positive number");
      }
    }
  
    setFileSize(value) {
      if (typeof value === 'number' && value > 0) {
        this.fileSize = value;
      } else {
        throw new Error("File size must be a positive number");
      }
    }
  
    setType(value) {
      const validTypes = ['pdf', 'docx', 'application/pdf'];
      if (validTypes.includes(value)) {
        this.type = value;
      } else {
        throw new Error(`Invalid file type. Supported types are: ${validTypes.join(', ')}`);
      }
    }
  
    setStatus(value) {
      const validStatuses = ['pending', 'approved', 'disapproved'];
      if (validStatuses.includes(value)) {
        this.status = value;
      } else {
        throw new Error(`Invalid status. Valid statuses are: ${validStatuses.join(', ')}`);
      }
    }
  
    setReport(value) {
      if (typeof value === 'string' || value === null) {
        this.report = value;
      } else {
        throw new Error("Report must be a string or null");
      }
    }
}
  
export default File;
  