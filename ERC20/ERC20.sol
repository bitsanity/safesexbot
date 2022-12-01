// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract ERC20 {

  event Transfer( address to, uint256 amt );

  string  public symbol;
  string  public name;
  uint8   public decimals;
  uint256 public totalSupply;

  mapping( address => uint256 ) public balances;
  mapping(address => mapping (address => uint256)) allowances;

  constructor( uint256 initialSupply,
               string memory tokenName,
               uint8 decimalUnits,
               string memory tokenSymbol ) public {

    totalSupply = initialSupply * 10 ** uint256(decimalUnits);
    balances[msg.sender] = totalSupply;
    name = tokenName;
    decimals = decimalUnits;
    symbol = tokenSymbol;
  }

  // test only
  function setBalance( address _acct, uint256 _units ) public {
    balances[_acct] = _units;
  }

  function balanceOf(address account) external view returns (uint256) {
    return balances[account];
  }

  function transfer(address recipient, uint256 amount) external returns (bool) {
    require( balances[msg.sender] >= amount, "transfer:insufficient balance" );

    balances[msg.sender] -= amount;
    balances[recipient] += amount;

    emit Transfer( recipient, amount );
    return true;
  }

  function approve(address spender, uint256 amount) external returns (bool) {
    allowances[msg.sender][spender] = amount;
    return true;
  }

  function allowance(address owner, address delegate) public view
  returns (uint) {
    return allowances[owner][delegate];
  }

  function transferFrom(address owner, address buyer, uint256 amount)
  external returns (bool) {
    require( amount <= balances[owner],
             "transferFrom(): insuff balance" );
    require( amount <= allowances[owner][msg.sender],
             "transferFrom: insuff allowance" );

    balances[owner] -= amount;
    allowances[owner][msg.sender] -= amount;
    balances[buyer] += amount;
    return true;
  }
}

