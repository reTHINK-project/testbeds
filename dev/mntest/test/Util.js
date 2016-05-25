
export default class Util {

  expectConnected(m, runtimeStubURL) {
    expect(m.type).to.eql("update");
    expect(m.from).to.eql(runtimeStubURL);
    expect(m.to).to.eql(runtimeStubURL + "/status");
    expect(m.body.value).to.eql("connected");
  }

  expectDisconnected(m, runtimeStubURL) {
    expect(m.type).to.eql("update");
    expect(m.from).to.eql(runtimeStubURL);
    expect(m.to).to.eql(runtimeStubURL + "/status");
    expect(m.body.value).to.eql("disconnected");
  }

}
