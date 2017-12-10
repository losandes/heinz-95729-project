module.exports.name = 'FPGrowthRecommendation'
module.exports.factory = function Factory() {
    const item = require('./FpItem.js').factory()
    const node = require('./FpNode.js').factory()
    const frequentItems = require('./FrequentItems.js').factory()
    const fpTreeFactory = require('./FpTree.js').factory
    const fpTreeMinerFactory = require('./FpTreeMiner.js').factory
    const treePrinterFactory = require('./FpTreePrinter.js').factory
    const trainingData = require('./orders.json');
    const timeTrainData = require('./orders_time_based.json');
    const FpTreeClass = require('./FpTree.js').factory()
    const FpTree = fpTreeFactory(item, frequentItems, node)
    const fpTreeMiner = fpTreeMinerFactory(FpTreeClass, node)
    const trainingTree = new FpTree(trainingData, 4);
    

    const getRecommendation = function (productIds) {
        const threshold = 1;
        const results = new fpTreeMiner(trainingTree).findPatterns(productIds, threshold);
        const resultsTree = new FpTree(results, threshold);
        return Object.keys(resultsTree.tree.children);
    }

    const getRecommendationByTime = function(productIds, time) {

    }

    return {getRecommendation, getRecommendationByTime}
}