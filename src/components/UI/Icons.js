import {
  MaterialIcons,
  Feather,
  FontAwesome6,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Fontisto
} from '@expo/vector-icons';

const Icons = {};

const Add = () => <MaterialIcons name='add' size={16} color='#665679' />;
const Close = () => <MaterialIcons name='close' size={16} color='#665679' />;
const Delete = () => <MaterialIcons name='delete' size={16} color='#665679' />;
const Edit = () => <MaterialIcons name='edit' size={16} color='#665679' />;
const Submit = () => <MaterialIcons name='check' size={16} color='#665679' />;
const Profile = () => <MaterialIcons name='person' size={16} color='#665679' />;
const Star = () => <MaterialIcons name='star' size={16} color='#665679' />;
const Paint = () => <FontAwesome6 name='brush' size={16} color='#665679' />;
const Moon = () => <Feather name='moon' size={16} color='#665679' />;
const Home = () => <AntDesign name='home' size={16} color='#665679' />;
const Settings = () => <Feather name='settings' size={16} color='#665679' />;
const Signin = () => <AntDesign name='login' size={16} color='#665679' />;
const Signout = () => <AntDesign name='logout' size={16} color='#665679' />;
const Book = () => <Ionicons name='book-outline' size={16} color='#665679' />;
const Help = () => <Feather name='help-circle' size={16} color='#665679' />;
const Eye = () => (
  <MaterialCommunityIcons name='eye-outline' size={16} color='#665679' />
);
const Food = () => (
  <MaterialCommunityIcons name='food-fork-drink' size={16} color='#665679' />
);
const Progress = () => (
  <MaterialIcons name='auto-graph' size={16} color='#665679' />
);
const Scanner = () => (
  <Ionicons name='barcode-sharp' size={16} color='#665679' />
);
const Question = () => (
  <MaterialCommunityIcons
    name='message-question-outline'
    size={16}
    color='#665679'
  />
);
const Map = () => <Fontisto name='map' size={16} color='#665679' />;
const Sync = () => <Ionicons name='sync' size={20} color='#665679' />;

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
Icons.Signout = Signout;
Icons.Book = Book;
Icons.Help = Help;
Icons.Eye = Eye;
Icons.Food = Food;
Icons.Progress = Progress;
Icons.Scanner = Scanner;
Icons.Question = Question;
Icons.Map = Map;
Icons.Sync = Sync;

export default Icons;
