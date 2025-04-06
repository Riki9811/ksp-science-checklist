const CONTENT_FULL = `GAME {
    version = 1.12.5
    Mode = CAREER
    RemovedROCs
    {
        ROCId = -1606429980
        ROCId = -1606429879
    }
    SCENARIO
    {
        name = ROCScenario
        scene = 7
    }
    SCENARIO
	{
		name = ResearchAndDevelopment
		scene = 7, 8, 5, 6
		sci = 123.45
        Tech
        {
            id = temp
        }
        Science
        {
            id = science@tempId
            sci = 5
            cap = 10
        }
        Science
        {
            id = science2@tempId2
            sci = 6
            cap = 12
        }
    }
    SCENARIO
    {
        name = OtherScenario
    }
}`;

const CONTENT_NO_VERSION = `GAME {
    Mode = SCIENCE_SANDBOX
    RemovedROCs
    {
        ROCId = -1606429980
        ROCId = -1606429879
    }
    SCENARIO
    {
        name = ROCScenario
        scene = 7
    }
    SCENARIO
	{
		name = ResearchAndDevelopment
		scene = 7, 8, 5, 6
		sci = 50
        Tech
        {
            id = temp
        }
        Science
        {
            id = science@tempId
            sci = 1.2
            cap = 2.6
        }
    }
    SCENARIO
    {
        name = OtherScenario
    }
}`;

const CONTENT_NO_MODE = `GAME {
    version = 1.10.1
    RemovedROCs
    {
        ROCId = -1606429980
        ROCId = -1606429879
    }
    SCENARIO
    {
        name = ROCScenario
        scene = 7
    }
    SCENARIO
	{
		name = ResearchAndDevelopment
		scene = 7, 8, 5, 6
		sci = 75
        Tech
        {
            id = temp
        }
    }
    SCENARIO
    {
        name = OtherScenario
    }
}`;

const CONTENT_NO_R_AND_D = `GAME {
    version = 1.9.0
    Mode = SANDBOX
    RemovedROCs
    {
        ROCId = -1606429980
        ROCId = -1606429879
    }
    SCENARIO
    {
        name = ROCScenario
        scene = 7
    }
    SCENARIO
    {
        name = OtherScenario
    }
}`;

const CONTENT_MALFORMED = `GARBAGE {
    invalid = true
    data = null
}`;

export default {
	CONTENT_FULL,
	CONTENT_NO_VERSION,
	CONTENT_NO_MODE,
	CONTENT_NO_R_AND_D,
	CONTENT_MALFORMED
};
