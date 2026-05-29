import DOMPurify from 'dompurify';

function ArticleViewer({ articleRef, handleArticleClick, currentTitle, articleHtml }) {
  return (
    <section 
      className="article-container" 
      ref={articleRef}
      onClick={handleArticleClick}
    >
      {currentTitle && <h1 className="article-title">{currentTitle}</h1>}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(articleHtml) }} />
    </section>
  );
}

export default ArticleViewer;