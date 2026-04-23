/**
 * Article Page - 文章页面
 */

import React, { FC } from 'react';
import { Typography, Row, Col } from 'antd';
import { WebsiteNav, WebsiteFooter } from '@/components/WebsiteLayout';
import './index.less';

const { Title, Paragraph } = Typography;

const ArticlePage: FC = () => {
  const relatedArticles = [
    { id: 1, title: 'Article Title', author: 'Author Name' },
    { id: 2, title: 'Article Title', author: 'Author Name' },
    { id: 3, title: 'Article Title', author: 'Author Name' },
  ];

  return (
    <div className="article-page">
      {/* Navigation */}
      <WebsiteNav siteName="BRAND" />

      {/* Article Header */}
      <section className="article-header">
        <div className="section-content">
          <Title level={1} className="article-title">
            Article or post title
          </Title>
          <Paragraph className="article-subtitle">
            Subheading that sets up context, shares more info about the author, or
            generally gets people psyched to keep reading
          </Paragraph>
        </div>
      </section>

      {/* Featured Image */}
      <section className="article-featured-image">
        <div className="section-content">
          <div className="placeholder-image">
            <span className="placeholder-text">Featured Image (1280 x 650)</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="article-content">
        <div className="section-content">
          <div className="content-wrapper">
            <Paragraph className="article-paragraph">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
              veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat.

              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
              doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
              inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </Paragraph>
          </div>

          {/* Two Images */}
          <Row gutter={32} className="article-images">
            <Col xs={24} md={12}>
              <div className="placeholder-image">
                <span className="placeholder-text">624 x 436</span>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="placeholder-image">
                <span className="placeholder-text">624 x 436</span>
              </div>
            </Col>
          </Row>

          <div className="content-wrapper">
            <Paragraph className="article-paragraph">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
              fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
              sequi nesciunt.

              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi tempora
              incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="related-articles-section">
        <div className="section-content">
          <Title level={2} className="section-heading">
            Related articles or posts
          </Title>
          <Row gutter={[32, 32]}>
            {relatedArticles.map((article) => (
              <Col xs={24} md={8} key={article.id}>
                <div className="related-article-card">
                  <div className="related-article-image">
                    <div className="placeholder-image">
                      <span className="placeholder-text">404 x 346</span>
                    </div>
                  </div>
                  <div className="related-article-content">
                    <Title level={4}>{article.title}</Title>
                    <Paragraph type="secondary">{article.author}</Paragraph>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
};

export default ArticlePage;
