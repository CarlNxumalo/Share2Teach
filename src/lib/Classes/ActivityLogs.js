class ActivityLogs {
    constructor(ActivityLogs_ID, TimeStamp, activity_type, activity_description,date_created) {
        this.ActivityLogs = ActivityLogs_ID;
        this.setTimeStamp(TimeStamp);
        this.setActivityType(activity_type);
        this.setActivityDescription(activity_description);
        this.setDateCreated(date_created);
    }

    // Getters
   

   getActivityType()
   {
    return this.activity_type;
   }

   getActivityDescription()
   {
    return this.activity_description;
   }

   getTimeStamp()
   {
    return this.TimeStamp;
   }

  

    setActivityType(value)
    {
        this.activity_type = value;
    }
    
    setActivityDescription(value)
    {
        this.activity_description = value;
    }

    setTimeStamp(value)
    {
        this.TimeStamp = value;
    }

    setDateCreated(value)
    {
        this.date_created= value;
    }
    
}

export default ActivityLogs;//.
