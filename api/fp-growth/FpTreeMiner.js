module.exports.name = 'FpTreeMiner'
module.exports.dependencies = ['FpTree', 'FpNode']
module.exports.factory = function Factory (FpTree, Node) {
  return function (fpTreeInstance) {
    // Procedure FP- growth(Tree, a) {
    //     (01) if Tree contains a single prefix path then { // Mining single prefix-path FP-tree
    //         (02) let P be the single prefix-path part of Tree;
    //         (03) let Q be the multipath part with the top branching node replaced by a null root;
    //         (04) for each combination (denoted as ß) of the nodes in the path P do
    //             (05) generate pattern ß ∪ a with support = minimum support of nodes in ß;
    //         (06) let freq pattern set(P) be the set of patterns so generated;
    //     }
    //     (07) else let Q be Tree;
    //     (08) for each item ai in Q do { // Mining multipath FP-tree
    //         (09) generate pattern ß = ai ∪ a with support = ai.support;
    //         (10) construct ß’s conditional pattern- base and then ß’s conditional FP- tree Tree ß;
    //         (11) if Tree ß ≠ Ø then
    //             (12) call FP- growth(Tree ß , ß);
    //         (13) let freq pattern set(Q) be the set of patterns so generated;
    //     }
    // (14) return (freq pattern set(P) ∪ freq pattern set(Q) ∪ (freq pattern set(P) × freq pattern set(Q)))
    // }

    const findPatterns = (query, threshold = 1) => {
      throw new Error('TODO')
    }

    return { findPatterns }
  }
}
