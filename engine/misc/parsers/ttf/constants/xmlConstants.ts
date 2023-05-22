
export class XMLConstants {

    // Namespace URIs
    public static readonly XML_NAMESPACE_URI = "http://www.w3.org/XML/1998/namespace";
    public static readonly XMLNS_NAMESPACE_URI = "http://www.w3.org/2000/xmlns/";
    public static readonly XLINK_NAMESPACE_URI = "http://www.w3.org/1999/xlink";
    public static readonly XML_EVENTS_NAMESPACE_URI = "http://www.w3.org/2001/xml-events";

    // Namespace prefixes
    public static readonly XML_PREFIX = "xml";
    public static readonly XMLNS_PREFIX = "xmlns";
    public static readonly XLINK_PREFIX = "xlink";

    // xml:{base,id,lang,space} and XML Events attributes
    public static readonly XML_BASE_ATTRIBUTE = "base";
    public static readonly XML_ID_ATTRIBUTE = "id";
    public static readonly XML_LANG_ATTRIBUTE = "lang";
    public static readonly XML_SPACE_ATTRIBUTE = "space";

    public static readonly XML_BASE_QNAME = this.XML_PREFIX + ':' + this.XML_BASE_ATTRIBUTE;
    public static readonly XML_ID_QNAME = this.XML_PREFIX + ':' + this.XML_ID_ATTRIBUTE;
    public static readonly XML_LANG_QNAME = this.XML_PREFIX + ':' + this.XML_LANG_ATTRIBUTE;
    public static readonly XML_SPACE_QNAME = this.XML_PREFIX + ':' + this.XML_SPACE_ATTRIBUTE;

    public static readonly XML_DEFAULT_VALUE = "default";
    public static readonly XML_PRESERVE_VALUE = "preserve";

    public static readonly XML_EVENTS_EVENT_ATTRIBUTE = "event";

    // XLink attributes
    public static readonly XLINK_HREF_ATTRIBUTE = "href";
    public static readonly XLINK_HREF_QNAME = this.XLINK_PREFIX + ':' + this.XLINK_HREF_ATTRIBUTE;

    // Serialization constants
    public static readonly XML_TAB = "    ";
    public static readonly XML_OPEN_TAG_END_CHILDREN = " >";
    public static readonly XML_OPEN_TAG_END_NO_CHILDREN = " />";
    public static readonly XML_OPEN_TAG_START = "<";
    public static readonly XML_CLOSE_TAG_START = "</";
    public static readonly XML_CLOSE_TAG_END = ">";
    public static readonly XML_SPACE = " ";
    public static readonly XML_EQUAL_SIGN = "=";
    public static readonly XML_EQUAL_QUOT = "=\"";
    public static readonly XML_DOUBLE_QUOTE = "\"";
    public static readonly  XML_CHAR_QUOT = '"';
    public static readonly  XML_CHAR_LT = '<';
    public static readonly  XML_CHAR_GT = '>';
    public static readonly XML_CHAR_APOS = '\'';
    public static readonly  XML_CHAR_AMP = '&';
    public static readonly XML_ENTITY_QUOT = "&quot;";
    public static readonly XML_ENTITY_LT = "&lt;";
    public static readonly XML_ENTITY_GT = "&gt;";
    public static readonly XML_ENTITY_APOS = "&apos;";
    public static readonly XML_ENTITY_AMP = "&amp;";
    public static readonly XML_CHAR_REF_PREFIX = "&#x";
    public static readonly XML_CHAR_REF_SUFFIX = ";";
    public static readonly XML_CDATA_END = "]]>";
    public static readonly XML_DOUBLE_DASH = "--";
    public static readonly XML_PROCESSING_INSTRUCTION_END = "?>";

    // XML versions
    public static readonly XML_VERSION_10 = "1.0";
    public static readonly XML_VERSION_11 = "1.1";
}
