# Identity Provider
##  Description of Component

The Identity Provider (IdP) provides a service that autenticates users, provides proofs of past authentication process (called identity assertions), and checks the validity of such assertions.
It also provides IdP-Proxy to the IdModule deployed on the runtime so that this IdModule may interact with the IdP whatever protocol it may use.

Two OpenID Connect-compliant Identity Providers have been customised and deployed for demonstration purpose:
1. the first one is an OAuth2/OIDC server with added support for IdP-Proxy, adapted from agmoyano/OpenIDConnect [1];
2. the second one is adapted from Nat Sakumura phpOIDC implementation [2].

## Metrics 
Since IdP is a purely request-based service, the most relevant KPIs would characterize response time, for instance average response time and 9th decile:
- for authentication requests,
- for assertion generation,
- for assertion verification.

However, IdP requests per user should be scarce compared to communication-related exchanges, especially on our testbeds which constitute more of a prototype environment. Moreover, the goal of reTHINK is to let the user choose his/her identity provider, which could thus be Google or Facebook. Therefore, tests limites tho the two provided IdP would not be relevant. Finally, it is not the responsibility of reTHINK to test reference implementation of identity protocols such as OpenID Connect. Indeed, IdPs are peripheral support services and will not be critical in evaluating overall environment performance. As a matter of fact, they are pre-existing (almost 'legacy') platforms whose functionalities are needed within reTHINK project but not results of reTHINK.

## Tests 
No server performance tests are planned. 

Conformance tests have been conducted to enable the use of IdP-Proxy according to the IETF specifications of the WebRTC Security architecture [3].

The application IdP-Proxy test is installed with the IdP Server and processes 3 actions: it loads the IdP-Proxy if implemented, generates and validates an Identity assertion if the user is logged on this IdP. An example of the application is accessible  [here](https://oidc-ns.kermit.orange-labs.fr/IdPProxy_test.html).

Tests conduced on IdP-Proxy have been conducted using a Firefox platform, and have provided the following results: 
- Javascript IdP-Proxy loading: 
  - min time : 4ms 
  - max time : 13ms 
  - av time : 8.9ms 
- Javascript generate assertion 
  - min time : 327ms 
  - max time : 1235ms 
  - av time : 553ms 
- Javascript validate assertion 
  - min time : 147ms 
  - max time : 296ms 
  - av time : 214ms 

It should be noted that the results are highly related to the client machine. Also, the length of the salt has a very low influence on the processing time.

# References

[1] agmoyano/OpenIDConnect. Available on GitHub Repository at https://github.com/agmoyano/OpenIDConnect; last accessed June 2016.

[2] phpOIDC. Available on Bitbucket Repository at https://bitbucket.org/PEOFIAMP/phpoidc; last accessed June 2016.

[3] WebRTC Security architecture, https://tools.ietf.org/html/draft-ietf-rtcweb-security-arch-12; last accessed June 2016.
