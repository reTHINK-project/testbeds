# Trust Engine

## Description of Component

The Trust Engine can be seen as a service providing information regarding trust in a communication peer, structured in several quantities or vectors that may be combined or grouped to certain levels. But the decision who is trusted and who is not trusted is very personal and should be up to the user.

The Trust Engine exposes a REST-based API where a user can send a userID or a GUID of and gets in return information about the trustworthiness of this Identity. The requesting application or service is then responsible to process this information in an useful way.

For the first remlease implemented in reTHINK project, Trust Engine is limited to management of personal whitelists and blacklists. 

## Metrics

Since Trst Engine is a purely request-based service, the most relevant KPIs would characterize response time, for instance average response time and 9th decile:
- for authentication requests,
- for assertion generation,
- for assertion verification.

## Tests

No server performance tests are planned.
