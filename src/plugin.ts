import type { App, Plugin } from 'vue';
import { Avatar } from './components/Avatar';
import { Badge } from './components/Badge';
import { Button } from './components/Button';
import { Checkbox } from './components/Checkbox';
import { Card } from './components/Card';
import { Collapse } from './components/Collapse';
import { Cursor } from './components/Cursor';
import { Descriptions } from './components/Descriptions';
import { Divider } from './components/Divider';
import { Drawer } from './components/Drawer';
import { Empty } from './components/Empty';
import { Form } from './components/Form';
import { FormItem } from './components/FormItem';
import { Input } from './components/Input';
import { List } from './components/List';
import { Message } from './components/Message';
import { Modal } from './components/Modal';
import { Notification } from './components/Notification';
import { Pagination } from './components/Pagination';
import { Popover } from './components/Popover';
import { Progress } from './components/Progress';
import { Radio } from './components/Radio';
import { RadioGroup } from './components/RadioGroup';
import { Rate } from './components/Rate';
import { Select } from './components/Select';
import { Slider } from './components/Slider';
import { Switch } from './components/Switch';
import { Tabs } from './components/Tabs';
import { Tag } from './components/Tag';
import { Textarea } from './components/Textarea';
import { Tooltip } from './components/Tooltip';
import { Loading } from './components/Loading';

const components = [
    Avatar,
    Badge,
    Button,
    Checkbox,
    Card,
    Collapse,
    Cursor,
    Descriptions,
    Divider,
    Drawer,
    Empty,
    Form,
    FormItem,
    Input,
    List,
    Message,
    Modal,
    Notification,
    Pagination,
    Popover,
    Progress,
    Radio,
    RadioGroup,
    Rate,
    Select,
    Slider,
    Switch,
    Tabs,
    Tag,
    Textarea,
    Tooltip,
    Loading,
];

const AnimalIslandUIVue: Plugin = {
    install(app: App) {
        components.forEach((component) => {
            if (component.name) {
                app.component(component.name, component);
            }
        });
    },
};

export default AnimalIslandUIVue;
