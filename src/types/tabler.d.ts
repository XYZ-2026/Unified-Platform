declare module '@tabler/icons-react' {
  import * as React from 'react';

  export interface IconProps extends React.SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    stroke?: string | number;
  }

  export type Icon = React.FC<IconProps>;
  export type TablerIcon = React.FC<IconProps>;

  export const IconBlockquote: any;
  export const IconArrowBackUp: any;
  export const IconArrowForwardUp: any;
  export const IconChevronDown: any;
  export const IconRowInsertBottom: any;
  export const IconColumnInsertRight: any;
  export const IconTableOff: any;
  export const IconTypography: any;
  export const IconHighlight: any;
  export const IconPalette: any;
  export const IconSend: any;
  export const IconSparkles: any;
  export const IconChevronLeft: any;
  export const IconDeviceFloppy: any;
  export const IconDownload: any;
  export const IconBook: any;
  export const IconChevronRight: any;
  export const IconUpload: any;
  export const IconX: any;
  export const IconArrowRight: any;
  export const IconFileTypePdf: any;
  export const IconBold: any;
  export const IconItalic: any;
  export const IconUnderline: any;
  export const IconStrikethrough: any;
  export const IconH1: any;
  export const IconH2: any;
  export const IconH3: any;
  export const IconList: any;
  export const IconListNumbers: any;
  export const IconAlignLeft: any;
  export const IconAlignCenter: any;
  export const IconAlignRight: any;
  export const IconAlignJustified: any;
  export const IconSubscript: any;
  export const IconSuperscript: any;
  export const IconTable: any;
  export const IconCheck: any;
  export const IconAlertTriangle: any;
  export const IconAlertCircle: any;
  export const IconInfoCircle: any;
  export const IconTrash: any;
  export const IconPlus: any;
  export const IconMinus: any;
  export const IconFileText: any;
  export const IconFile: any;
  export const IconFileCode: any;
  export const IconBrandOpenai: any;
  export const IconRefresh: any;
  export const IconCopy: any;
  export const IconScissors: any;
  export const IconWand: any;
  export const IconEye: any;
  export const IconEyeOff: any;
  export const IconMaximize: any;
  export const IconMinimize: any;
  export const IconAdjustments: any;
  export const IconSettings: any;
  export const IconHelp: any;
  export const IconExternalLink: any;
  export const IconMessage: any;
  export const IconMessage2: any;
  export const IconRobot: any;
  export const IconBrain: any;
  export const IconHistory: any;
  export const IconFileSpreadsheet: any;
  export const IconCode: any;
  export const IconQuote: any;

  const icons: Record<string, any>;
  export default icons;
}
