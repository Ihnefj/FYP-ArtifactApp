import {
  MaterialIcons,
  Feather,
  FontAwesome6,
  AntDesign,
  Ionicons
} from '@expo/vector-icons';

const Icons = {};

const Add = () => <MaterialIcons name='add' size={16} />;
const Close = () => <MaterialIcons name='close' size={16} />;
const Delete = () => <MaterialIcons name='delete' size={16} />;
const Edit = () => <MaterialIcons name='edit' size={16} />;
const Submit = () => <MaterialIcons name='check' size={16} />;
const Profile = () => <MaterialIcons name='person' size={16} />;
const Star = () => <MaterialIcons name='star' size={16} />;
const Paint = () => <FontAwesome6 name='brush' size={16} />;
const Moon = () => <Feather name='moon' size={16} />;
const Home = () => <AntDesign name='home' size={16} />;
const Settings = () => <Feather name='settings' size={16} />;
const Signin = () => <AntDesign name='login' size={16} />;
const Book = () => <Ionicons name='book-outline' size={16} />;
const Help = () => <Feather name='help-circle' size={16} />;

// Compose
Icons.Add = Add;
Icons.Close = Close;
Icons.Delete = Delete;
Icons.Edit = Edit;
Icons.Submit = Submit;
Icons.Profile = Profile;
Icons.Star = Star;
Icons.Paint = Paint;
Icons.Moon = Moon;
Icons.Home = Home;
Icons.Settings = Settings;
Icons.Signin = Signin;
Icons.Book = Book;
Icons.Help = Help;

export default Icons;
