import DOMPurify from "dompurify";

const RawHtml = ({ html, style }) => (
	<div style={style} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);

export default RawHtml;