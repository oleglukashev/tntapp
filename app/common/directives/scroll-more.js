export default function scrollMore() {
  return {
    restricted: 'A',
    link: (scope, element, attrs) => {
      const listener = () => {
        // Call given callback if scrollbar has reached bottom of the page
        // Usage: `<div scroll-more="loadSomethingPieceByPiece()">...</div>`
        if (!document.getElementById('char_wrapper')) {
          window.removeEventListener('scroll', listener);
          return false;
        }

        if (window.innerHeight + Math.ceil(window.pageYOffset + 1) >= document.body.offsetHeight) {
          scope.$apply(attrs.scrollMore);
        }
      }

      window.addEventListener('scroll', listener);
    },
  };
}
