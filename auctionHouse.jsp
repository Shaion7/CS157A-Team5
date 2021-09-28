<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.sql.*"%>
<html>
<head>
<title>JDBC Connection example</title> 
</head>
<body>
	<h1>JDBC Connection example</h1> 
	<% 
    	String db = "auction_house";
       String user = "root"; // assumes database name is the same as username
       String password = ""; // INSERT PASSWORD HERE
       try {
           
           java.sql.Connection con; 
           Class.forName("com.mysql.jdbc.Driver");
           con = DriverManager.getConnection("jdbc:mysql://localhost:3306/" + db + "?autoReconnect=true&useSSL=false",user, password);
           out.println(db + " database successfully opened.<br/><br/>");
           
           out.println("Initial entries in table \"users\": <br/>");
           Statement stmt = con.createStatement();
           ResultSet rs = stmt.executeQuery("SELECT * FROM users");
           while (rs.next()) {
               out.println(rs.getInt(1) + " " + rs.getString(2) + " " + rs.getString(3) + "<br/><br/>");
           }
           rs.close();
           stmt.close();
           con.close();
       } catch(SQLException e) { 
           out.println("SQLException caught: " + e.getMessage()); 
       }
   %>
</body>
</html>