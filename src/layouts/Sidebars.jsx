import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const drawerWidth = 200

export default function ResponsiveDrawerRight({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Todo", icon: <ListAltIcon />, url: "/" },
    { text: "Kanban", icon: <ViewKanbanIcon />, url: "/kanban" },
    { text: "Weather", icon: <CloudQueueIcon />, url: "/weather" },
    { text: "Wikipedia", icon: <MenuBookIcon />, url: "/wiki" },
    { text: "TaskManagement", icon: <TableChartIcon/>, url: "/task"}
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <List sx={{ mt: 2 }  }>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.url}
              onClick={() => setMobileOpen(false)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box  sx={{ display: "flex", }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        {children}
      </Box>

      {/* Mobile
         display: { xs: "block", sm: "none" } hide when on PC but show on mobile
      */}
      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          backgroundColor: "rgba(190, 182, 182, 0.53)",
          padding: "4px 8px",
          borderRadius: 2,
          display: { xs: "block", sm: "none" },
          zIndex: 1200,
        }}>
        <Button
          startIcon={<MenuIcon />}
          onClick={toggleDrawer}
          variant="text"
          color="inherit">
          Menu
        </Button>
      </Paper>

      {/* Drawer Menu */}
      <Box component="nav" sx={{ width: { sm: drawerWidth } }}>
        {/* Drawer for mobile (Button) */}
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}>
          {drawerContent}
        </Drawer>

        {/* Drawer for PC (Permanent) */}
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open>
          {drawerContent}
        </Drawer>
      </Box>
    </Box>
  );
}
