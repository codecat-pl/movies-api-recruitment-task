exports.expectFail = async function expectFail(func){
    try {
        await func();
        return Promise.reject("This line should not be executed.");
    }catch(err){
        return Promise.resolve(err);
    }
};