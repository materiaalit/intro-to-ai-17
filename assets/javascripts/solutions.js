import { uniqueId, kebabCase, chunk } from 'lodash';
import { scrollToId } from './utils';

class Solutions {
  mount() {

    this.headingNodes = $('.solution h1, .solution h2');
    this.solutionNodes = $('.solution');
    this.solutionListNode = $('#solution-list');

    this.addIds();
    this.addNumbers();
  }

  addIds() {
    this.solutionNodes.each(function() {
      const solutionNode = $(this);
      const collapseNode = solutionNode.find('.collapse');
      const toggleNode = solutionNode.find('.solution__toggle');
      const headingNode = solutionNode.find('.solution__heading');

      const id = `${uniqueId('solution-')}-${kebabCase(headingNode.text())}`;

      solutionNode.attr('data-name', headingNode.text());
      solutionNode.attr('data-href', `#${id}`);
      solutionNode.attr('id', `${id}-root`);
      collapseNode.attr('id', id);
      toggleNode.attr('href', `#${id}`);
    });
  }

  addNumbers() {
    let indices = [];
    const solutionNames = [];

    this.headingNodes.each(function() {
      const headingNode = $(this);
      const hIndex = parseInt(this.nodeName.substring(1)) - 1;

      if(hIndex === 0) {
        const solutionNode = headingNode.closest('.solution');

        solutionNames.push({
          name: solutionNode.data('name'),
          href: solutionNode.data('href')
        });
      }

      if (indices.length - 1 > hIndex) {
        indices = indices.slice(0, hIndex + 1 );
      }

      if (indices[hIndex] == undefined) {
        indices[hIndex] = 0;
      }

      indices[hIndex]++;

      headingNode.prepend(`
        <small class="text-muted">
          Solution:
        </small>
      `);
    });

    this.solutionNames = solutionNames;
  }

  onClicksolutionLink(e) {
    const id = `${e.target.getAttribute('href').substring(1)}-root`;
    scrollToId(id);
  }
}

export default Solutions;
