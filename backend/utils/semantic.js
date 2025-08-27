import natural from "natural";
const tokenizer = new natural.WordTokenizer();

function cosine(a, b) {
  const all = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, na = 0, nb = 0;
  for (const k of all) {
    const va = a[k] || 0;
    const vb = b[k] || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function textToTf(text = "") {
  const tokens = tokenizer.tokenize((text || "").toLowerCase());
  const tf = {};
  tokens.forEach((t) => (tf[t] = (tf[t] || 0) + 1));
  return tf;
}

export function scoreByTfidf(queryText, docs, docTextAccessor) {
  const tfidf = new natural.TfIdf();
  const texts = docs.map(docTextAccessor);
  texts.forEach((t) => tfidf.addDocument((t || "").toLowerCase()));

  const qtf = textToTf(queryText);
  // turn tfidf weights into sparse vectors for cosine similarity
  const vectors = docs.map((_d, i) => {
    const v = {};
    Object.keys(qtf).forEach((term) => {
      const w = tfidf.tfidf(term, i);
      if (w) v[term] = w;
    });
    return v;
  });

  const qv = {};
  Object.keys(qtf).forEach((term) => (qv[term] = 1)); // simple weights for query

  return docs
    .map((doc, i) => ({ doc, score: cosine(qv, vectors[i]) }))
    .sort((a, b) => b.score - a.score);
}
