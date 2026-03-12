<?php
$orderData = json_decode($_POST["orderJSON"], true);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmation</title>
  <link rel="stylesheet" href="styles/style.css">
  <link rel='stylesheet' type='text/css' media='screen' href='styles/style-custom-sharpth.css'>
</head>
<body>

<header>
  <h1>Big Fish Bistro</h1>
  <img src="images/BFB-logo.jpg" id="logo-header">
  <nav>
    <ul id="header-list">
      <li><a href="/projects/big-fish-bistro/home.html">Home</a></li>
      <li><a href="/projects/big-fish-bistro/menu.html">Menu</a></li>
      <li><a class="active" href="/projects/big-fish-bistro/menu-order.html">Interactive Order</a></li>
      <li><a href="/projects/big-fish-bistro/order.html">Order</a></li>
      <li><a href="/projects/big-fish-bistro/reviews.html">Reviews</a></li>
    </ul>
  </nav>
</header>
<main>
<p><strong>Name:</strong> <?php echo htmlspecialchars($_POST["name"]); ?></p>
    <p><strong>Phone:</strong> <?php echo htmlspecialchars($_POST["phone"]); ?></p>
    <p><strong>Tip Percentage:</strong> <?php echo htmlspecialchars($_POST["tip"]); ?></p>
    <p><strong>Dining Method:</strong> <?php echo htmlspecialchars($_POST["dining"]); ?></p>
    <p><strong>Order Recieved:</strong></p> 
    <p><?php echo htmlspecialchars($_POST["orderJSON"]); ?></p>
    <p><strong>Order Received (Readable):</strong></p>
    <pre><?php echo htmlspecialchars(json_encode($orderData, JSON_PRETTY_PRINT)); ?></pre>
</main>

<footer>
  <h3>Website by: Thomas Sharp</h3>
</footer>

</body>
</html>