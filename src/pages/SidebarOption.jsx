// Define the SidebarOption component as a functional component that takes in props
function SidebarOption({ text, Icon, active, onClick  }) 
{
  // Event handler for clicking the SidebarOption
  const handleClick = () => 
  {
    if (onClick) 
    {
      onClick();
    }
  };

  // JSX structure for rendering the SidebarOption
  return (
    <div className={`sidebarOption ${active && 'sidebarOption--active'}`} onClick={handleClick}>
      {/* Render the provided Icon component */}
      <Icon />
      {/* Render the text prop */}
      <h2>{text}</h2>
    </div>
  );
}

// Export the SidebarOption component as the default export
export default SidebarOption;