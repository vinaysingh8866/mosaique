const machine:[{
    machineId: string,
    displayName: String,
    startingState: string,
    states: [{
        stateId: string,
        stateName: String,
        roles: [{
            roleId: string,
            displayData: [{
                displayType: String,
                displayContent: String,
                displayAction: string
            }],
            actions: [{
                actionId: string,
                actionName: String,
                transitionID: string                
            }]
        }],
        transitions: [{
            transitionId: string,
            transitionName: String,
            conditions: [{
                conditionName: String,
                condition: String,
                newState: string
            }]
        }]
    }]
  }] = [];


  //MONGO_CONNECTIONSTRING=mongodb://18.218.32.128:26015/nest