import { Position, Toaster, Intent } from "@blueprintjs/core";
export {
  Spinner,
  Button,
  Intent,
  Navbar,
  NavbarDivider,
  NavbarHeading,
  Alignment,
  NavbarGroup,
  ProgressBar,
  FileInput,
  MenuItem,
  Card,
  Elevation,
  Dialog,
  Classes,
  AnchorButton,
  NumericInput,
  Checkbox,
  Icon,
  Tag,
  Drawer,
  Overlay,
  Position,
  Divider,
  InputGroup,
  Tooltip,
  Hotkey,
  Hotkeys,
  HotkeysTarget,
  Alert,
  Toast,
  Toaster
} from "@blueprintjs/core";

export { Suggest } from "@blueprintjs/select";

export const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
  maxToasts: 3
});
