# analysis.R — summarise sales by region.
library(dplyr)
library(ggplot2)
suppressPackageStartupMessages(require(readr))

#' Load and clean the sales data.
#'
#' @param path Path to a CSV file.
#' @param min_total Drop rows below this total.
#' @return A tibble.
#' @export
load_sales <- function(path, min_total = 0, ...) {
  stopifnot(is.character(path), file.exists(path))
  raw <- readr::read_csv(path, show_col_types = FALSE, ...)
  raw %>%
    filter(!is.na(total), total >= min_total) %>%
    mutate(month = as.Date(format(date, "%Y-%m-01")),
           region = factor(region, levels = c("north", "south", "east", "west")))
}

Sales <- setRefClass("Sales", fields = list(data = "data.frame", currency = "character"),
  methods = list(
    total = function() sum(data$total, na.rm = TRUE),
    show = function() cat("Sales:", nrow(data), "rows in", currency, "\n")
  ))

MAX_ROWS <- 1e6L
hex_flag <- 0xFF
ratio = 2.5e-3
TRUE -> flag
missing <- c(NA, NA_integer_, NULL, NaN, Inf, -Inf)

sales <- load_sales("data/sales.csv", min_total = 10)
summary_tbl <- sales |>
  group_by(region, month) |>
  summarise(revenue = sum(total), orders = n(), .groups = "drop") |>
  arrange(desc(revenue))

for (r in levels(sales$region)) {
  if (nrow(sales[sales$region == r, ]) == 0L) next
  message(sprintf("%-6s %10.2f", r, sum(sales$total[sales$region == r])))
}

top <- if (nrow(summary_tbl) > 0) summary_tbl[[1, "region"]] else NA_character_
pattern <- r"(\d{4}-\d{2})"
matches <- grepl("^north", summary_tbl$region, ignore.case = TRUE)

ggplot(summary_tbl, aes(x = month, y = revenue, colour = region)) +
  geom_line(linewidth = 1) +
  labs(title = "Revenue by region", subtitle = paste0("Top: ", top)) +
  theme_minimal()

obj <- Sales$new(data = as.data.frame(sales), currency = "USD")
obj$show()
invisible(lapply(split(sales, sales$region), function(df) nrow(df) %in% c(0, 1)))
